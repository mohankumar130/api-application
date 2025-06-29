pipeline {
    agent any

    environment {
        IMAGE_NAME = 'api-application'
        CONTAINER_NAME = 'api-application-login'
        DOCKER_PORT = '3000'
        VERSION = "${env.BUILD_NUMBER}"
    }

    stages {
        stage('Clean Workspace') {
            steps {
                deleteDir()
            }
        }

        stage('Git Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/mohankumar130/api-application.git'
            }
        }

        stage('Docker Build') {
            steps {
                sh "docker build -t \$IMAGE_NAME:\$VERSION ."
            }
        }

        stage('Stop & Remove Old Container') {
            steps {
                sh """
                docker stop \$CONTAINER_NAME || true
                docker rm \$CONTAINER_NAME || true
                """
            }
        }

        stage('Run New Container') {
            steps {
                sh "docker run -d --name \$CONTAINER_NAME --env-file .env -p \$DOCKER_PORT:3000 \$IMAGE_NAME:\$VERSION"
            }
        }

        stage('Delete Old Images') {
            steps {
                script {
                    // Remove older tagged versions of IMAGE_NAME except current
                    sh """
                    docker images --format "{{.Repository}}:{{.Tag}} {{.ID}}" | grep "^${IMAGE_NAME}:" | grep -v ":${VERSION}" | awk '{print \$2}' | xargs -r docker rmi -f || true
                    """
                }
            }
        }

        stage('Prune Dangling Images') {
            steps {
                sh 'docker image prune -f'
            }
        }
    }

    post {
        success {
            echo "✅ Deployed Docker Image: ${env.IMAGE_NAME}:${env.VERSION}"
        }
        failure {
            echo '❌ Deployment failed.'
        }
    }
}
