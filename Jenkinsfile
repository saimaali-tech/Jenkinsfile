
pipeline {
    agent any

    environment {
        EC2_USER = 'ubuntu'
        EC2_HOST = 'YOUR.EC2.PUBLIC.IP'
        SSH_CREDENTIALS_ID = 'ec2-ssh-key'
        APP_DIR = '/home/ubuntu/my-app'
        NPM_PATH = '/root/.nvm/versions/node/v22.17.0/bin/npm' // updated npm path
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
                    sh """
                        ssh -o StrictHostKeyChecking=no ${env.EC2_USER}@${env.EC2_HOST} '
                            mkdir -p ${env.APP_DIR} &&
                            rm -rf ${env.APP_DIR}/*
                        '
                    """

                    sh """
                        scp -o StrictHostKeyChecking=no -r ./my-app/dist/* ${env.EC2_USER}@${env.EC2_HOST}:${env.APP_DIR}
                    """

                    sh """
                        ssh ${env.EC2_USER}@${env.EC2_HOST} '
                            pkill -f "npx serve" || true
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
