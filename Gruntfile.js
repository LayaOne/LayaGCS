'use strict';  

module.exports = function (grunt) {  

    // Project configuration.  
    grunt.initConfig({  

       

     uglify: {
        my_target: {
          files: {
            'layagcs.min.js': ['layagcs.min.js'],
          }
        }
    }
    

    

    });

    grunt.registerTask('uglify', [
        'uglify'
    ]);

    
   
    grunt.registerTask('minify',['uglify']);
    grunt.loadNpmTasks('grunt-contrib-uglify-es');


}