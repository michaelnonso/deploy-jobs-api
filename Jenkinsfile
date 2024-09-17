pipeline {
  agent any
  stages {
    stage('checkout code') {
      parallel {
        stage('checkout code') {
          steps {
            git(url: 'https://github.com/michaelnonso/deploy-jobs-api', branch: 'main')
          }
        }

        stage('parallel stage') {
          steps {
            sh 'echo "step in parallel stage"'
          }
        }

      }
    }

  }
}