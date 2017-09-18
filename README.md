# Yarn parser

A tiny node.js web service for parsing dependency information from `yarn.lock` files for [Libraries.io](https://libraries.io).

## Docker

You can use Docker to run yarn-parser

First, install Docker. If you've got run macOS or Windows, Docker for Mac/Windows makes this really easy.

If you have Windows Home Edition, you'll need to download and run Docker Toolbox.
Then, run:

    docker run -it -e PORT=5000 -p 5000:5000 yarn-parser

yarn-parser will be running on http://localhost:5000.

Note: You can add PORT to a .env file instead of supplying them directly on the command-line.

## Development

Source hosted at [GitHub](http://github.com/librariesio/yarn-parser).
Report issues/feature requests on [GitHub Issues](http://github.com/librariesio/yarn-parser/issues). Follow us on Twitter [@librariesio](https://twitter.com/librariesio). We also hangout on [Slack](http://slack.libraries.io).

### Note on Patches/Pull Requests

 * Fork the project.
 * Make your feature addition or bug fix.
 * Add tests for it. This is important so I don't break it in a
   future version unintentionally.
 * Add documentation if necessary.
 * Commit, do not change procfile, version, or history.
 * Send a pull request. Bonus points for topic branches.

## Copyright

Copyright (c) 2017 Andrew Nesbitt. See [LICENSE](https://github.com/librariesio/yarn-parser/blob/master/LICENSE) for details.
