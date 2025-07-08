pipeline {
    agent any

    environment {
        EC2_USER = 'ubuntu'                          // use 'ec2-user' for Amazon Linux
        EC2_HOST = 'YOUR.EC2.PUBLIC.IP'              // replace with your actual IP
        SSH_KEY = credentials('ec2-ssh-key')         // must match the ID in Jenkins credentials
        APP_DIR = '/home/ubuntu/my-app'              // update to match your EC2 path
    }

    stages {
        stage('Checkout Code') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm ci'  // faster and safer than `npm install` for CI
            }
        }

        stage('Build App') {
            steps {
                dir('my-app') {
                    sh 'npm run build'
                }
            }
        }

        stage('Deploy to EC2') {
            steps {
                sshagent(credentials: ['ec2-ssh-key']) {
                    sh """
                        ssh -o StrictHostKeyChecking=no $EC2_USER@$EC2_HOST '
                            mkdir -p $APP_DIR &&
                            rm -rf $APP_DIR/*'
                    """

                    sh """
                        scp -o StrictHostKeyChecking=no -r ./my-app/dist/* $EC2_USER@$EC2_HOST:$APP_DIR
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
