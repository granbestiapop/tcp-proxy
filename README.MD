## Usage

Simple TCP proxy server

TCP(layer4) proxy for postgresql database
Start postgresql database on 5432 port.

```
npx github:granbestiapop/tcp-proxy 5555 localhost 5432
```

Then connect to postgresql using proxy server

``` 
psql -hlocalhost -p5555 -Upostgres
```

Use cases:

- Proxy from private VPCs to local environment.
