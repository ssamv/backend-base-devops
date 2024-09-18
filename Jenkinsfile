pipeline {
    agent any

    environment {
        DOCKER_REGISTRY = 'localhost:8086'
        DOCKER_IMAGE_NAME = 'backend-base-devops'
        //DOCKER_CREDENTIALS_ID = 'credenciales-docker'
        NEXUS_CREDENTIALS_ID = 'nexus-credentials'
        SONARQUBE_SERVER = 'sonarqube'
        KUBECONFIG = credentials('kubeconfig-credential')
        KUBERNETES_DEPLOYMENT = 'backend-base-devops'
        KUBERNETES_CONTAINER = 'backend-base-container'
    }

    stages {

        stage('APP Test and Build') {
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
                    withSonarQubeEnv("${SONARQUBE_SERVER}") { 
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
                script{
                    docker.withRegistry("http://${DOCKER_REGISTRY}","${NEXUS_CREDENTIALS_ID}"){
                        sh "docker push ${DOCKER_REGISTRY}/${DOCKER_IMAGE_NAME}:${env.BUILD_NUMBER}"
                    }
                }
                
            }
        }

        stage('Kubernetes') {
            agent {
                docker {
                    image 'bitnami/kubectl:latest'  // Imagen Docker con kubectl preinstalado
                    args '--entrypoint=""' 
                    reuseNode true
                }
            }
            stages{
                stage('Verificar conexión a Kubernetes') {
                    steps {
                        sh 'kubectl version --client'  // Aquí ejecutas comandos de kubectl
                    }
                }
                stage('Actualizar imagen en Kubernetes'){
                    steps {
                        script {
                            withCredentials([file(credentialsId: 'kubeconfig-credential', variable: 'KUBECONFIG')]) {
                                sh """
                                kubectl set image deployment ${KUBERNETES_DEPLOYMENT} ${KUBERNETES_CONTAINER}=${DOCKER_REGISTRY}/${DOCKER_IMAGE_NAME}:${env.BUILD_NUMBER} --kubeconfig=$KUBECONFIG
                                """
                            }
                        }
                    }
                }
            }
            
        }
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