#!/usr/bin/env node

const { Socket, createServer } = require('node:net');

process.on('uncaughtException', (error) => {
  console.log('uncaught exception: ', error);
  process.exit(1);
});

if (process.argv.length != 5) {
  console.log(
    'usage: %s <localport> <remotehost> <remoteport>',
    process.argv[1]
  );
  process.exit(1);
}

const localport = process.argv[2];
const remotehost = process.argv[3];
const remoteport = process.argv[4];

const server = createServer((localsocket) => {
  const remotesocket = new Socket();

  remotesocket.connect(remoteport, remotehost);

  localsocket.on('connect', () => {
    console.log(
      'new connection #%d from %s:%d',
      server.connections,
      localsocket.remoteAddress,
      localsocket.remotePort
    );
  });

  localsocket.on('data', (data) => {
    const flushed = remotesocket.write(data);
    if (!flushed) {
      localsocket.pause();
    }
  });

  remotesocket.on('data', (data) => {
    const flushed = localsocket.write(data);
    if (!flushed) {
      remotesocket.pause();
    }
  });

  localsocket.on('drain', () => {
    remotesocket.resume();
  });

  remotesocket.on('drain', () => {
    localsocket.resume();
  });

  localsocket.on('close', () => {
    remotesocket.end();
  });

  remotesocket.on('close', () => {
    localsocket.end();
  });
});

server.listen(localport);

console.log(
  'starting 127.0.0.1:%d to %s:%d',
  localport,
  remotehost,
  remoteport
);
