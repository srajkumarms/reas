module.exports = function(grunt) {
    "use strict";

    require("load-grunt-tasks")(grunt);
	grunt.loadNpmTasks('erkalicious-grunt-watch');

    var hostName = "127.0.0.1",
        port = 9001,
		rootDir = "./webapp/";
		// rootDir = "../../dist/webapp/";

    grunt.initConfig({
        connect: {
            server: {
                options: {
                    port: port,
                    base: rootDir,
                    hostname: hostName,
                    index: "index.html",
                    open: true,
                    keepalive: true,
                    livereload: true
                }
            }
        },
        watch: {
			options: {
				dirs: [rootDir + "/**", rootDir + "/**/*", "!" + rootDir + "**/bower_components/**/*", "!" + rootDir + "**/node_modules/**/*", "!" + rootDir + "**/assets/**/*"],
				extensions: ["js", "css", "html", "ts", "png", "gif", "jpg", "svg"],
			},
            src: {
            }
        },
        concurrent: {
            options: {
                logConcurrentOutput: true
            },
            server: {
                tasks: [["wiredep", "connect:server"], "watch"]
            }
        },
        wiredep: {
            target: {
                src: rootDir + "/index.html",
            }
        }
    });

    grunt.registerTask("launch", "Launch the server and realod changes", [
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
