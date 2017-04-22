# couchdb2-replicator-not-scalable-vagrant

This project demonstrates how CouchDB's _replicator database consumes resources even when the databases that are being replicated aren't being changed. Assume you have a db-per-user design that requires replication per user. With just say 10,000 users you'll need 10,000 concurrent database connections even though only a fraction of those users will be active simultaneously.


Install Vagrant, VirtualBox and git
---
* http://www.vagrantup.com
* https://www.virtualbox.org (don't worry about setting up any VMs as the steps below will cover this)
* http://git-scm.com


Run Demo
---

    $ git clone https://github.com/redgeoff/couchdb2-replicator-not-scalable-vagrant
    $ cd couchdb2-replicator-not-scalable-vagrant
    $ vagrant up
    $ vagrant ssh
    $ npm run demo
      This leads to an internal_server_error because the out-of-the-box config of CouchDB doesn't
      allow for 1,000 concurrent file handles and database connections. Of course, we can tweak
      these values, but this just masks the problem that we are consuming resources by replicating
      databases that don't have any changes.
