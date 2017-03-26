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
            "html": {
				"files": [rootDir + "/**/*.html"],
				"tasks": ["wiredep", "less:compile", "postcss"]
            },
            "css": {
                "files": [
					rootDir + "/resources/**/*.less",
					rootDir + "/views/**/*.less",
					"!" + rootDir + "**/bower_components/**/*.less",
					"!" + rootDir + "**/node_modules/**/*.less",
					"!" + rootDir + "**/assets/**/*.less"
				],
                "tasks": ["less:compile", "postcss"]
            },
            // js: {
            //     files: ['src/js/*.js'],
            //     tasks: ['uglify:dev']
            // }
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
		}
    });

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
