pipeline {
    agent any

    environment {
        DOCKER_REGISTRY = 'localhost:8086'
        DOCKER_IMAGE_NAME = 'backend-base-devops'
        //DOCKER_CREDENTIALS_ID = 'credenciales-docker'
        NEXUS_CREDENTIALS_ID = 'nexus-credentials'
        SONARQUBE_SERVER = 'sonarqube'
        SONARQUBE_CREDENTIALS_ID = 'token-sonar'
        /*KUBECONFIG = credentials('credenciales-kubeconfig')
        KUBERNETES_DEPLOYMENT = 'nombre-del-deployment'
        KUBERNETES_NAMESPACE = 'nombre-del-namespace'*/
    }

    stages {

        stage('Build and test') {
            agent {
                docker {
                    image 'node:20.11.1-alpine3.19'
                    reuseNode true
                }
            }
            stages{
                stage ('install') {
                    steps {
                        sh 'npm install'
                    }
                }

                stage ('test'){
                    steps  {
                        sh 'npm test'
                    }
                }

                stage ('build'){
                    steps {
                        sh 'npm run build'
                    }
                }

            }
            
            
        }

        stage('Analizar calidad en SonarQube') {
            agent {
                docker {
                    image 'sonarsource/sonar-scanner-cli'
                    args '--network="devops-sebamv_default"'
                    reuseNode true
                }
            }
            steps {
                script {
                    withSonarQubeEnv('sonarqube') { 
                        // Enviar reporte a SonarQube
                        sh 'sonar-scanner'
                    }
                }
            }
        }

        stage('Validar puerta de calidad') {
            steps {
                    waitForQualityGate abortPipeline: true
            }
        }

        
        stage('Construcción de imagen Docker') {
            steps {
                sh "docker build -t ${DOCKER_REGISTRY}/${DOCKER_IMAGE_NAME}:${env.BUILD_NUMBER} ."
            }
        }

        stage('Subir a Nexus') {
            steps {
                docker.withRegistry("${DOCKER_REGISTRY}","${NEXUS_CREDENTIALS_ID}"){
                    sh "docker push ${DOCKER_REGISTRY}/${DOCKER_IMAGE_NAME}:${env.BUILD_NUMBER}"
                }
            }
        }

        /*stage('Actualizar imagen en Kubernetes') {
            steps {
                script {
                    sh """
                    kubectl set image deployment/${KUBERNETES_DEPLOYMENT} ${KUBERNETES_DEPLOYMENT}=${DOCKER_REGISTRY}/${DOCKER_IMAGE_NAME}:${env.BUILD_NUMBER} --namespace=${KUBERNETES_NAMESPACE}
                    """
                }
            }
        }*/
    }

    post {
        always {
            cleanWs() // Limpiar el workspace después del build
        }
        success {
            echo 'Pipeline completado exitosamente'
        }
        failure {
            echo 'Pipeline falló'
        }
    }
}