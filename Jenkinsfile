pipeline {
    agent any

    environment {
        IMAGE_NAME = 'api-application'
        CONTAINER_NAME = 'api-application-login'
        DOCKER_PORT = '3000'
        VERSION = "${env.BUILD_NUMBER}"
        NEW_RELIC_APP_ID = credentials('new_relic_app_id') // Store App ID as credential
        NEW_RELIC_API_KEY = credentials('new_relic_api_key') // Secure API key
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
                sh "docker build -t ${IMAGE_NAME}:${VERSION} ."
            }
        }

        stage('Stop & Remove Old Container') {
            steps {
                sh """
                    docker stop ${CONTAINER_NAME} || true
                    docker rm ${CONTAINER_NAME} || true
                """
            }
        }

        stage('Run New Container') {
            steps {
                sh """
                    docker run -d --name ${CONTAINER_NAME} \
                    --env-file .env \
                    -p ${DOCKER_PORT}:3000 \
                    ${IMAGE_NAME}:${VERSION}
                """
            }
        }

        stage('Delete Old Images') {
            steps {
                sh """
                    docker images --format "{{.Repository}}:{{.Tag}} {{.ID}}" | \
                    grep "^${IMAGE_NAME}:" | grep -v ":${VERSION}" | \
                    awk '{print \$2}' | xargs -r docker rmi -f || true
                """
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
            echo "✅ Deployed Docker Image: ${IMAGE_NAME}:${VERSION}"

            withCredentials([
                string(credentialsId: 'NEW_RELIC_API_KEY', variable: 'NEW_RELIC_API_KEY'),
                string(credentialsId: 'NEW_RELIC_APP_ID', variable: 'NEW_RELIC_APP_ID')
            ]) {
                sh '''
                    echo "📡 Sending New Relic deployment notification..."
                    curl -X POST https://api.newrelic.com/v2/applications/${NEW_RELIC_APP_ID}/deployments.json \
                         -H "X-Api-Key: ${NEW_RELIC_API_KEY}" \
                         -H "Content-Type: application/json" \
                         -d '{
                            "deployment": {
                                "revision": "'"${GIT_COMMIT_HASH}"'",
                                "description": "Deployed ${IMAGE_NAME}:${VERSION} via Jenkins",
                                "user": "jenkins"
                            }
                         }' --insecure
                '''
            }
        }

        failure {
            echo '❌ Deployment failed.'
        }
    }
}
