pipeline {
    agent any

    environment {
        EC2_USER = 'ubuntu'
        EC2_HOST = 'YOUR.EC2.PUBLIC.IP' // Replace this with your actual EC2 public IP
        SSH_CREDENTIALS_ID = 'ec2-ssh-key'
        APP_DIR = '/home/ubuntu/Jenkinsfile'
    }

    stages {
        stage('Checkout Code') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                sh "${env.NPM_PATH} ci"
            }
        }

        stage('Build App') {
            steps {
                dir('my-app') {
                    sh "${env.NPM_PATH} run build"
                }
            }
        }

        stage('Deploy to EC2') {
            steps {
                sshagent(credentials: [env.SSH_CREDENTIALS_ID]) {
                    // Clean target directory on EC2
                    sh """
                        ssh -o StrictHostKeyChecking=no ${env.EC2_USER}@${env.EC2_HOST} '
                            mkdir -p ${env.APP_DIR} &&
                            rm -rf ${env.APP_DIR}/*
                        '
                    """

                    // Copy built app to EC2
                    sh """
                        scp -o StrictHostKeyChecking=no -r ./my-app/dist/* ${env.EC2_USER}@${env.EC2_HOST}:${env.APP_DIR}
                    """

                    // Serve the app using npx serve
                    sh """
                        ssh ${env.EC2_USER}@${env.EC2_HOST} '
                            pkill -f "npx serve" || true
                            nohup ${env.NPX_PATH} serve -s ${env.APP_DIR} -l 3000 > ${env.APP_DIR}/serve.log 2>&1 &
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
