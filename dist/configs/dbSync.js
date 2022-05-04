"use strict";Object.defineProperty(exports, "__esModule", {value: true});var _client = require('@prisma/client');

const dbSync = new (0, _client.PrismaClient)();

exports.dbSync = dbSync; exports.Prisma = _client.Prisma;