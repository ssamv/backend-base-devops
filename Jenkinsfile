pipeline {
    agent any

    environment {
        DOCKER_REGISTRY = 'localhost:8086'
        DOCKER_IMAGE_NAME = 'backend-base-devops'
        //DOCKER_CREDENTIALS_ID = 'credenciales-docker'
        NEXUS_CREDENTIALS_ID = 'nexus-credentials'
        SONARQUBE_SERVER = 'sonarqube'
        SONARQUBE_CREDENTIALS_ID = 'sonarqube-credentials'
        /*KUBECONFIG = credentials('credenciales-kubeconfig')
        KUBERNETES_DEPLOYMENT = 'nombre-del-deployment'
        KUBERNETES_NAMESPACE = 'nombre-del-namespace'*/
    }

    stages {

        stage('Instalar dependencias') {
            agent {
                docker {
                    image 'node:20.11.1-alphine3.19'
                }
            }
            steps {
                script {
                    // Si estás usando Node.js
                    sh 'npm install'
                    
                    // Si estás usando Maven o Gradle, usa sus respectivos comandos
                    // sh 'mvn install'
                    // sh './gradlew build'
                }
            }
        }

        stage('Testing') {
            agent{
                docker{
                    image 'node:20.11.1-alphine3.19'
                }
            }
            steps {
                script {
                    // Ejecución de pruebas
                    sh 'npm test' // o el comando de tu herramienta de pruebas
                }
            }
        }

        stage('Analizar calidad en SonarQube') {
            steps {
                script {
                    withSonarQubeEnv('sonarqube') { 
                        // Enviar reporte a SonarQube
                        sh 'mvn sonar:sonar' // o el comando que uses para sonar
                    }
                }
            }
        }

        stage('Validar puerta de calidad') {
            steps {
                waitForQualityGate abortPipeline: true
            }
        }

        stage('Construcción del Build') {
            steps {
                script {
                    // Si usas npm
                    sh 'npm run build'
                    
                    // Si usas Maven o Gradle
                    // sh 'mvn package'
                    // sh './gradlew assemble'
                }
            }
        }

        stage('Construcción de imagen Docker') {
            steps {
                script {
                    sh """
                    docker build -t ${DOCKER_REGISTRY}/${DOCKER_IMAGE_NAME}:${env.BUILD_NUMBER} .
                    """
                }
            }
        }

        stage('Subir a Nexus') {
            steps {
                script {
                    docker.withRegistry(${DOCKER_REGISTRY},${NEXUS_CREDENTIALS_ID}){
                        sh """
                        docker push ${DOCKER_REGISTRY}/${DOCKER_IMAGE_NAME}:${env.BUILD_NUMBER}
                        """
                    }
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