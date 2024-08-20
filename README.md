## Step-by-Step Procedure for CI/CD Pipeline to AWS ECS for Docker App Using GitHub, CodeBuild, CodePipeline, ECR, and ECS

# Prerequisites

AWS Account with administrative privileges.
Docker installed on your local machine.
A GitHub repository containing your Dockerized application.

# Install and Configure AWS CLI

Step 1: Install AWS CLI
Download the AWS CLI Installer:

For Windows: Download the AWS CLI MSI installer from AWS CLI Downloads.
For macOS:

```
curl "https://awscli.amazonaws.com/AWSCLIV2.pkg" -o "AWSCLIV2.pkg"
sudo installer -pkg AWSCLIV2.pkg -target /
```


For Linux:

```
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install
```

Verify Installation:

Open your terminal or command prompt and run:

```
aws --version
```

You should see the AWS CLI version output, confirming the installation.

Step 2: Configure AWS CLI

Configure AWS CLI with Your Credentials:

Run the following command:

```
aws configure
```
Enter the required information:

AWS Access Key ID: Your AWS access key.
AWS Secret Access Key: Your AWS secret key.
Default region name: The AWS region you want to use (e.g., us-west-2).
Default output format: Typically json (you can also choose text or table).

Verify Configuration:

Run the following command to check your AWS identity:

```
aws sts get-caller-identity
```
This command should return details about your IAM user, confirming that the CLI is configured correctly.

# Create an AWS ECR Repository

Navigate to ECR (Elastic Container Registry):

Open the AWS Management Console and navigate to the ECR service.

Create a New Repository:

Click on Create repository.

Enter a name for your repository (e.g., mydockerapp).
Choose settings like Visibility (Private/Public), Scan on push (optional), and KMS encryption (optional).
Click Create repository.

Note the Repository URI:

After creation, note the repository URI (e.g., 123456789012.dkr.ecr.region.amazonaws.com/mydockerapp), as you'll need it in the build process.

# Create an AWS ECS Cluster

Navigate to ECS (Elastic Container Service):

Open the AWS Management Console and navigate to the ECS service.

Create a New Cluster:

Click on Clusters and then Create Cluster.
Choose Networking only for Fargate tasks or EC2 Linux + Networking for EC2-based tasks, depending on your requirements.
Enter a cluster name 

Configure Networking (for EC2 Cluster):

If using an EC2 cluster, configure the instance type, number of instances, and networking settings like VPC and subnets.
Click Create to finalize the cluster setup.

# Create an ECS Task Definition

Navigate to Task Definitions:

In the ECS console, click on Task Definitions and then Create new Task Definition.
Choose Launch Type:

Select the launch type: Fargate or EC2.

Configure Task Definition:

Enter a name for the task definition
Task Role: Choose an IAM role that ECS tasks will use for permissions.
Network Mode: For Fargate, choose awsvpc; for EC2, choose the appropriate network mode.

Add Container:

Click on Add container.
Enter a container name
In the Image field, enter the URI of your ECR repository 
Set the Memory Limits and Port Mappings as per your application's requirements 
Click Add.

Create the Task Definition:

After configuring all required settings, click Create.

# Create an AWS CodePipeline

Navigate to CodePipeline:

Open the AWS Management Console and navigate to the CodePipeline service.
Click Create Pipeline.

Configure Pipeline:

Enter the Pipeline Name
Choose the New Service Role option for Service Role or use an existing one.
Click Next.

# Source Stage Configuration (GitHub)
Select Source Provider:

Choose GitHub as the source provider.
Click on Connect to GitHub.
Authorize AWS to access your GitHub account.

Select Repository:

Choose your GitHub repository from the list.
Select the branch that triggers the pipeline (e.g., main).

Source Output Artifact:

Name the output artifact (e.g., source_output).
Click Next.

# Build Stage Configuration (CodeBuild)

Select Build Provider:

Choose AWS CodeBuild as the build provider.
Click on Create Project.

Configure CodeBuild Project:

Project Name: Enter a name for the build project
Environment:
   Choose Managed Image.
   Operating system: Ubuntu.
   Runtime: Standard.
Service Role: Create a new role or use an existing one.
Buildspec:
   Choose Use a buildspec file.
   Buildspec name: Leave this as the default, which is buildspec.yml(already in the repo).

Save the build project and return to the pipeline creation process.
Click Next.

# Deploy Stage Configuration (ECS)

Deploy Provider:

Choose Amazon ECS as the deploy provider.

Configure ECS Deployment:

Cluster Name: Select your ECS cluster.
Service Name: Select the ECS service to deploy to.

Review the configuration and click Next.

# Review and Create the Pipeline

Review Pipeline:

Review the stages and configuration in the pipeline.

Create Pipeline:

Click Create Pipeline to start the process.

# Trigger and Monitor the Pipeline

Trigger the Pipeline:

Push changes to the selected branch in your GitHub repository.
This should automatically trigger the pipeline.

Monitor the Pipeline:

Monitor the progress of each stage in the AWS CodePipeline console.
Ensure that the source, build, and deploy stages complete successfully.

# Verify Deployment

Verify Deployment:

After a successful pipeline run, verify the deployment by checking the ECS service or accessing the application through its public endpoint.

Monitor ECS Services:

Use the ECS console to monitor the running tasks, logs, and any potential issues.