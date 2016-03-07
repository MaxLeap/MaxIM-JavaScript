module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);

  var SAUCE_BROWSERS = [{
    browserName: 'chrome'
  }, {
    browserName: 'internet explorer',
    version: '10.0'
  }];

  var HINT_SRCS = ['src/**/*.js', 'test/**/*.js', '*.js', '!**/*.browser.js'];

  grunt.initConfig({
    watch: {
      scripts: {
        files: HINT_SRCS,
        tasks: ['hint', 'release']
      },
    },
    babel: {
      dist: {
        files: [{
          expand: true,
          cwd: 'src/',
          src: '**/*.js',
          dest: 'lib/'
        }]
      }
    },
    browserify: {
      dist: {
        files: {
          'dist/ML.im.js': ['lib/ML.im.js']
        }
      },
      test: {
        files: {
          'test/browser/specs.browser.js': 'test/specs.js'
        },
        options: {
          transform: ['envify']
        }
      }
    },
    uglify: {
      dist: {
        files: {
          'dist/ML.im.js': ['dist/ML.im.js']
        }
      }
    },
    connect: {
      server: {
        options: {
          port: 8000,
          base: ''
        }
      }
    },
    simplemocha: {
      options: {
        timeout: 20000,
        ui: 'bdd'
      },
      all: {
        src: ['test/specs.js']
      }
    },
    'mocha_phantomjs': {
      all: {
        options: {
          urls: [
            'http://localhost:8000/test/browser/'
          ]
        }
      }
    },
    'saucelabs-mocha': {
      all: {
        options: {
          urls: ['http://localhost:8000/test/browser/'],
          build: process.env.CI_BUILD_NUMBER,
          testname: 'Sauce Test for LeanCloud realtime SDK',
          browsers: SAUCE_BROWSERS,
          throttled: 3,
          tunnelArgs: ['--vm-version', 'dev-varnish']
        }
      }
    },
    jshint: {
      all: {
        src: HINT_SRCS,
        options: {
          jshintrc: true
        }
      }
    },
    jscs: {
      src: HINT_SRCS
    }
  });
  grunt.registerTask('default', []);
  grunt.registerTask('hint', ['jshint', 'jscs']);
  grunt.registerTask('sauce', ['babel', 'browserify:test', 'connect', 'saucelabs-mocha']);
  grunt.registerTask('test', '', function() {
    var tasks = ['hint', 'babel', 'browserify:test', 'connect', 'simplemocha'];
    if (process.env.SAUCE_USERNAME && process.env.SAUCE_ACCESS_KEY) {
      tasks.push('saucelabs-mocha');
    } else {
      grunt.log.writeln('Skip saucelabs test, set SAUCE_USERNAME and SAUCE_ACCESS_KEY to start it.');
    }
    grunt.task.run(tasks);
  });
  grunt.registerTask('release', ['babel', 'browserify:dist']);
  grunt.registerTask('dev', ['hint', 'release', 'connect', 'watch']);
  var fs = require('fs');
};
