pipeline {
    agent {
        docker {
            image 'node:18'
        }
    }

    environment {
        EC2_USER = 'ubuntu'
        EC2_HOST = 'your.ec2.ip.here'
        SSH_KEY = credentials('ec2-ssh-key')
        APP_DIR = '/home/ubuntu/my-app'
    }

    stages {
        stage('Install Dependencies') {
            steps {
                sh 'npm ci'
            }
        }

        stage('Build App') {
            steps {
                sh 'npm run build'
            }
        }

        stage('Deploy to EC2') {
            steps {
                sshagent (credentials: ['ec2-ssh-key']) {
                    sh """
                        ssh -o StrictHostKeyChecking=no $EC2_USER@$EC2_HOST '
                            mkdir -p $APP_DIR &&
                            rm -rf $APP_DIR/*'
                    """
                    sh """
                        scp -o StrictHostKeyChecking=no -r ./dist/* $EC2_USER@$EC2_HOST:$APP_DIR
                    """
                    sh """
                        ssh $EC2_USER@$EC2_HOST '
                            cd $APP_DIR &&
                            nohup npx serve -s . -l 3000 > serve.log 2>&1 &
                        '
                    """
                }
            }
        }
    }

    post {
        success {
            echo '✅ Deployment completed successfully!'
        }
        failure {
            echo '❌ Deployment failed. Please check the logs.'
        }
    }
}
