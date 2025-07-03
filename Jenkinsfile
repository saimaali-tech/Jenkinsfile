pipeline {
    agent any

    environment {
        EC2_USER = 'ec2-user'                     // or 'ubuntu' for Ubuntu AMIs
        EC2_HOST = 'your.ec2.public.ip.address'   // Replace with your EC2 public IP
        SSH_KEY = credentials('ec2-ssh-key')      // Add this in Jenkins > Credentials
        APP_DIR = '/home/ec2-user/my-app'         // Target directory on EC2
    }

    stages {
        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Build App') {
            steps {
                sh 'cd my-app/'
                sh 'npm run build'   // Or adjust based on your app (e.g., React/Vite/Next)
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
                            nohup npx serve -s . -l 3000 &
                        '
                    """
                }
            }
        }
    }
}

