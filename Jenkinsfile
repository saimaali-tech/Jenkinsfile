pipeline {
    agent any

    environment {
        EC2_USER = 'ubuntu'
        EC2_HOST = 'your-ec2-ip'
        APP_DIR = '/home/ubuntu/Jenkinsfile'  // Directory on EC2
    }

    stages {
        stage('Clone Repository') {
            steps {
                git branch: 'main', url: 'https://github.com/saimaali-tech/Jenkinsfile.git'
            }
        }

        stage('Deploy to EC2') {
            steps {
                sshagent(credentials: ['your-ssh-key-id']) {
                    sh """
                        ssh -o StrictHostKeyChecking=no $EC2_USER@$EC2_HOST '
                            mkdir -p $APP_DIR &&
                            rm -rf $APP_DIR/*'
                        scp -o StrictHostKeyChecking=no -r * $EC2_USER@$EC2_HOST:$APP_DIR
                        ssh -o StrictHostKeyChecking=no $EC2_USER@$EC2_HOST '
                            cd $APP_DIR &&
                            npm install &&
                            pm2 restart app.js || pm2 start app.js'
                    """
                }
            }
        }
    }
}
