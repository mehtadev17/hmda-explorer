Please use the [fork and pull](https://help.github.com/articles/using-pull-requests#fork--pull) collaborative model.

1. Install [Node](http://nodejs.org/) and [Grunt](http://gruntjs.com/).
1. [Fork this repo](https://github.com/cfpb/hmda-explorer/fork) to your personal GH account.
1. `git clone git@github.com:YOUR-USERNAME/hmda-explorer.git`
1. `cd hmda-explorer`
1. `npm install`
1. `bower install`
1. `grunt build`
1. `grunt`
1. Open `localhost:8000` in a browser.

Only edit files in `src`. When anything is changed, Grunt will lint, test, compile and build everything. [grunt-cfpb-internal](https://github.com/cfpb/grunt-cfpb-internal) generates this README.

In lieu of a formal styleguide, take care to maintain the existing coding style.
