#!/bin/bash
pm2 kill && pm2 start dist/server.js && pm2 flush && pm2 logs server