module.exports = function(grunt) {
    "use strict";

    require("load-grunt-tasks")(grunt);
	var autoprefixer = require("autoprefixer");

    var hostName = "127.0.0.1",
        port = 9001,
        rootDir = "./webapp/";

    grunt.initConfig({
        "connect": {
            "server": {
                "options": {
                    "port": port,
                    "base": rootDir,
                    "hostname": hostName,
                    "index": "index.html",
                    "open": true,
                    "keepalive": true,
                    "livereload": true
                }
            }
        },
        "watch": {
			"options": {
				"livereload": true
			},
            "index": {
				"files": [rootDir + "/views/index.html"],
				"tasks":  ["wiredep"] // ["wiredep", "less:compile", "postcss"]
            },
            "css": {
                "files": [
					rootDir + "/resources/**/*.less",
					rootDir + "/views/**/*.less",
					"!" + rootDir + "**/bower_components/**/*.less",
					"!" + rootDir + "**/node_modules/**/*.less",
					"!" + rootDir + "**/assets/**/*.less"
				],
				"tasks": ["less:compile", "postcss"] // ["wiredep", "less:compile", "postcss"]
            },
            "js": {
                "files": [rootDir + "/views/**/*.js"],
				"tasks": ["wiredep", "less:compile", "postcss"]
            }
        },
        "concurrent": {
            "options": {
                "logConcurrentOutput": true
            },
            "server": {
                "tasks": ["wiredep", "connect:server", "watch"]
            }
        },
        "wiredep": {
            "target": {
                "src": rootDir + "/index.html",
            }
        },
        "less": {
            "compile": {
                "options": {
                    "path": [rootDir + "/**", rootDir + "/**/*"]
                },
                "files": {
                    [rootDir + "resources/styles/styles.css"]: rootDir + "resources/styles/styles.less"
                }
            }
        },
		"postcss": {
			"options": {
				"map": true,
				"processors": [autoprefixer({browsers: ['last 2 versions']})]
			},
			"dist": {
				"src": rootDir + "resources/styles/styles.css"
			}
		},
		"lesshint": {
			"options": {
				"lesshintrc": true,
				"reporter": {
					"name": "less-reporter",
					"report": function report(errors) {
						errors.forEach(function lessErrorItertator(error) {
							reportLessError(error);
						});
					}
				}
			},
			"src": [rootDir + "/**/*.less"]
		},
		"eslint": {
			"options": {
				configFile: "./.eslintrc"
			},
			"target": [
				rootDir + "/views/**/*.js",
				"!" + rootDir + "**/bower_components/**/*.js",
				"!" + rootDir + "**/node_modules/**/*.js"
			]
		}
    });

	function reportLessError(error) {
		grunt.log.error("---------------------------------------------------------");
		grunt.log.error(formatLessError(error, "column"));
		grunt.log.error(formatLessError(error, "file"));
		grunt.log.error(formatLessError(error, "fullPath"));
		grunt.log.error(formatLessError(error, "line"));
		grunt.log.error(formatLessError(error, "linter"));
		grunt.log.error(formatLessError(error, "message"));
		grunt.log.error(formatLessError(error, "severity"));
		grunt.log.error(formatLessError(error, "source"));
		grunt.log.error("---------------------------------------------------------");
	}

	function formatLessError(error, property) {
		return property + ": " + error[property];
	}

	function allCompileTasks() {
		return ["wiredep", "less:compile", "postcss"];
	}

	grunt.registerTask("compile", "Lint CSS, JS, TS before launch or relaod", [
		"lesshint",
		"eslint"
	]);

    grunt.registerTask("launch", "Launch the server and realod changes", [
        "less:compile",
		"postcss",
        "concurrent:server"
    ]);

    grunt.registerTask("prepare", "Developer-Profile", function developerProfile(target) {
        if (target === "minified") {
            grunt.log.write("Building minifed version... ").ok();
        } else {
            grunt.log.write("Building non-minifed version... ").ok();
        }

        grunt.task.run("launch");
    });
};
