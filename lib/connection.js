// Generated by CoffeeScript 1.6.3
/*
  backbone-sql.js 0.0.1
  Copyright (c) 2013 Vidigami - https://github.com/vidigami/backbone-sql
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
*/


(function() {
  var Connection, ConnectionPool, DatabaseUrl, Knex, KnexConnection, PROTOCOLS, _;

  _ = require('underscore');

  Knex = require('knex');

  ConnectionPool = require('backbone-orm/lib/connection_pool');

  DatabaseUrl = require('backbone-orm/lib/database_url');

  PROTOCOLS = {
    'mysql:': 'mysql',
    'mysql2:': 'mysql',
    'postgres:': 'postgres',
    'pg:': 'postgres',
    'sqlite:': 'sqlite3',
    'sqlite3:': 'sqlite3'
  };

  KnexConnection = (function() {
    function KnexConnection(knex) {
      this.knex = knex;
    }

    KnexConnection.prototype.destroy = function() {};

    return KnexConnection;

  })();

  module.exports = Connection = (function() {
    function Connection(full_url) {
      var connection_info, database_url, knex, protocol;
      database_url = new DatabaseUrl(full_url);
      this.url = database_url.format({
        exclude_table: true,
        exclude_query: true
      });
      if (this.knex_connection = ConnectionPool.get(this.url)) {
        return;
      }
      if (!(protocol = PROTOCOLS[database_url.protocol])) {
        throw "Unrecognized sql variant: " + full_url + " for protocol: " + database_url.protocol;
      }
      connection_info = _.extend({
        host: database_url.hostname,
        database: database_url.database,
        charset: 'utf8'
      }, database_url.parseAuth() || {});
      knex = Knex.initialize({
        client: protocol,
        connection: connection_info
      });
      ConnectionPool.set(this.url, this.knex_connection = new KnexConnection(knex));
    }

    Connection.prototype.knex = function() {
      var _ref;
      return (_ref = this.knex_connection) != null ? _ref.knex : void 0;
    };

    return Connection;

  })();

}).call(this);