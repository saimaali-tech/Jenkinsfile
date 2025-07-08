pipeline {
    agent any

    environment {
        // Replace with your actual EC2 details
        EC2_USER = 'ubuntu' // or 'ec2-user' for Amazon Linux
        EC2_HOST = 'YOUR.EC2.PUBLIC.IP' // update with your EC2 public IP
        SSH_CREDENTIALS_ID = 'ec2-ssh-key' // Jenkins credentials ID for SSH key
        APP_DIR = '/home/ubuntu/my-app' // target directory on EC2
        NPM_PATH = '/usr/local/bin/npm' // explicit path to npm
    }

    stages {
        stage('Checkout Code') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                script {
                    // Use the full path to npm
                    sh "${env.NPM_PATH} ci"
                }
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
                sshagent(credentials: [env.SSH_CREDENTIALS_ID]) {
                    // Create directory and clean old build
                    sh """
                        ssh -o StrictHostKeyChecking=no ${env.EC2_USER}@${env.EC2_HOST} '
                            mkdir -p ${env.APP_DIR} &&
                            rm -rf ${env.APP_DIR}/*
                        '
                    """

                    // Copy built files to EC2
                    sh """
                        scp -o StrictHostKeyChecking=no -r ./my-app/dist/* ${env.EC2_USER}@${env.EC2_HOST}:${env.APP_DIR}
                    """

                    // Serve the app using a simple server
                    sh """
                        ssh ${env.EC2_USER}@${env.EC2_HOST} '
                            # Stop existing serve process if any
                            pkill -f "npx serve" || true
                            # Start the serve process in background
                            nohup npx serve -s ${env.APP_DIR} -l 3000 > ${env.APP_DIR}/serve.log 2>&1 &
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
