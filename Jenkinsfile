pipeline {
  agent any
  stages {
    stage('checkout code') {
      steps {
        git(url: 'https://github.com/michaelnonso/deploy-jobs-api', branch: 'main')
      }
    }

  }
}