pipeline{
  
  agent any
  
  triggers { githubPush() }
  tools {nodejs "NodeJS"}
  
  options{
    ansiColor('xterm')
  }
  
  stages{
    stage("Install") {
      steps {
        sh "rm -rf node-modules/*"
        sh "npm cache clean --force"
        sh "npm install"
        sh 'sudo apt-get update'
      }
    }
    stage('Testing'){
      steps{
        sh "npm run test"
      }
    }
  }
}
