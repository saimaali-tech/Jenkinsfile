pipeline {
    agent any

    environment {
        EC2_USER = 'ubuntu'
        EC2_HOST = '3.25.199.168'
        REMOTE_DIR = '/home/ubuntu/Jenkinsfile'
        SSH_KEY = '/home/ubuntu/.ssh'
    }

    stages {
        stage('Clone Repo') {
            steps {
                git branch: 'main', url: 'https://github.com/saimaali-tech/Jenkinsfile.git'
            }
        }

        stage('Install Dependencies & Build') {
            steps {
                sh 'npm install'
                sh 'npm run build'
            }
        }

        stage('Deploy to EC2') {
            steps {
                sh """
                ssh -i $SSH_KEY -o StrictHostKeyChecking=no $EC2_USER@$EC2_HOST '
                    sudo rm -rf /var/www/html/*'
                
                scp -i $SSH_KEY -o StrictHostKeyChecking=no -r build/* $EC2_USER@$EC2_HOST:/var/www/html/
                """
            }
        }
    }
}
