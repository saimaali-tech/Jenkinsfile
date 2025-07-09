pipeline {
    agent any

    environment {
        EC2_USER = 'ubuntu'
        EC2_HOST = '3.106.239.136'
        REMOTE_DIR = '/home/ubuntu/Jenkinsfile'
        SSH_KEY = '/var/lib/jenkins/.ssh/my-jenkins-key'
    }

    stages {
        stage('Clone Repo') {
            steps {
                git branch: 'main', url: 'https://github.com/saimaali-tech/Jenkinsfile.git'
            }
        }

        stage('Deploy to EC2') {
            steps {
                sh """
                ssh -i $SSH_KEY -o StrictHostKeyChecking=no $EC2_USER@$EC2_HOST '
                    mkdir -p $REMOTE_DIR &&
                    rm -rf $REMOTE_DIR/*'
                
                scp -i $SSH_KEY -o StrictHostKeyChecking=no -r * $EC2_USER@$EC2_HOST:$REMOTE_DIR

                ssh -i $SSH_KEY -o StrictHostKeyChecking=no $EC2_USER@$EC2_HOST '
                    cd $REMOTE_DIR &&
                    npm install &&
                    pm2 restart app.js || pm2 start app.js'
                """
            }
        }
    }
}
