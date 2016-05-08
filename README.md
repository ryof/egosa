# egosa
[![MIT License](http://img.shields.io/badge/license-MIT-blue.svg?style=flat)](LICENSE)

egosearches your twitter timeline and notifies tweets you are mentioned via Pushover.

## Requirements
+ Docker
+ Pushover account
  - https://pushover.net/

## Installation
1. edit `default.json` and fill in API keys, search keywords, etc.
2. build image with: `docker build -t egosa .`
3. run with: `docker run egosa`

## Powered by ;)
[Magistol®](https://gist.github.com/Magistol/3040c89d342fb787b0fd)

## License
MIT
