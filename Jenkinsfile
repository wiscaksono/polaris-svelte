pipeline {
    agent any
    environment {
        PIPELINE_BUILD_IMAGE = "web-polaris"
        PIPELINE_NAME_SPACE = "polaris"
        PIPELINE_REPLICA = 1
        PIPELINE_LOAD_BALANCER_IP= "172.20.60.125"
        PIPELINE_LOAD_BALANCER_PORT=80
        PIPELINE_IMAGE = "harbor-registry-uat.msiglife.co.id/${env.PIPELINE_NAME_SPACE}/${env.PIPELINE_BUILD_IMAGE}:${env.BUILD_NUMBER}"
        def name_space = "${env.PIPELINE_NAME_SPACE}"
        def build_image = "${env.PIPELINE_BUILD_IMAGE}"
    }

    stages {
        stage('Checkout') {
            steps {
                git branch:'cloud-prod' ,credentialsId: 'biznetgio1', url: 'http://gitlab-prd.msiglife.co.id:8888/polaris/web-polaris-ts'  
            }
        }

        stage('Install Dependencies') {
            steps {
                // TODO: Confirm pnpm availibility
                sh 'pnpm install --frozen-lockfile'
            }
        }

        stage('Install Playwright Browsers') {
            steps {
                sh 'npx playwright install --with-deps'
            }
        }

        stage('Run E2E Tests') {
            steps {
                // This command will automatically start your dev server,
                // run tests, and then shut it down.
                sh 'npx playwright test'
            }
        }
        
        stage('dockerized') {
            steps{
                echo "Build Docker images ${env.PIPELINE_BUILD_IMAGE}"
                sh "docker build -t ${env.PIPELINE_BUILD_IMAGE} ."
            
            }
        }
        
        stage('Deploy To Docker Registry') {
            steps {
                echo "Docker Image Tag Name: ${env.PIPELINE_BUILD_IMAGE}"
                sh "docker tag ${env.PIPELINE_BUILD_IMAGE} ${env.PIPELINE_IMAGE}"
                sh "docker push ${env.PIPELINE_IMAGE}"
            }
        }

        stage("replace Env"){
            steps{
        	    sh "printenv"
                echo "replace env"
                sh "ls k8s/"
                sh "envsubst < k8s/deployment.yaml > k8s/deployment${PIPELINE_NAME_SPACE}${PIPELINE_BUILD_IMAGE}.yaml "
                sh "cat k8s/deployment${PIPELINE_NAME_SPACE}${PIPELINE_BUILD_IMAGE}.yaml"            
                sh "pwd"
            }
        }

        stage('deploy to kubernetes') {
            steps {
                sh "ls"
                sh '''
                ssh administrator@jenkins-gcp whoami
                scp k8s/deployment${name_space}${build_image}.yaml administrator@jenkins-gcp:~/.
                ssh administrator@jenkins-gcp kubectl apply -f deployment${name_space}${build_image}.yaml
                ssh administrator@jenkins-gcp kubectl -n ${name_space} rollout status deployment.app/${build_image}
                '''
                sh "docker rmi -f ${env.PIPELINE_IMAGE}"
            }
        }
    }

    post {
        always {
            echo 'Archiving test results...'
            junit 'test-results/results.xml'
            archiveArtifacts artifacts: 'test-results/', allowEmptyArchive: true
        }
    }
}

