# CMPT 470 FIRMS - Docker Setup and Deployment with Google Cloud Run

## Install Docker on Ubuntu

1. Install docker on ubuntu by first removing installed containerd.io and installing docker.io
    ```
    $ sudo apt-get remove containerd.io
    $ sudo apt install docker.io
    ```
2.  Check if docker service is working
    ```
    $ sudo service docker status
    ```
3. If the docker service is not running, start the service
    ```
    $ sudo service docker start
    ```
4. If the docker service is masked, unmask it, and then start the service
    ```
    $ sudo systemctl unmask docker
    $ sudo systemctl start docker
    $ sudo service docker start
    ```
5. Check if docker service is running
    ```
    $ sudo service docker status
    ```
6. If any issue arises please look here [Docker Help](https://ropenscilabs.github.io/r-docker-tutorial/04-Dockerhub.html)


# Install Google Cloud Platform SDK to Ubuntu and build docker image

1. Install the sdk google cloud on Ubuntu, if asked if want to continue, say "y"
    ```
    $ curl https://sdk.cloud.google.com | bash
    ```
2. Login to the google cloud platform with the google account associated with the cmpt470-firms project
    ```
    $ gcloud auth login
    ```
3. Configure docker to authenticate to Container Registry (Run this only once)
    ```
    $ gcloud auth configure-docker
    ```
4. Update google cloud components
    ```
    $ gcloud components update
    ```
5. Set project ID to Google cloud platform project
    ```
    $ gcloud config set project cmpt470-firms
    ```
6. To build a docker image with google cloud platform use the format: ```docker build -t gcr.io/<gcloud project id>/<Image-name> .```:
    ```
    $ docker build -t gcr.io/cmpt470-firms/firmsimage .
    ```
    To build production version:
    ```
    $ docker build -t gcr.io/cmpt470-firms/firmsimage-production -f Dockerfile-production .
    ```
    
7. Using docker, tag the image and push it to google cloud
    ```
    $ docker tag gcr.io/cmpt470-firms/firmsimage gcr.io/cmpt470-firms/cmpt470firms/firmsimage
    $ docker push gcr.io/cmpt470-firms/firmsimage
    ```

8. To run container on port 8080 locally run: 
    ```
    $docker run --rm -p 8080:8080 gcr.io/cmpt470-firms/firmsimage
    ```
    To run with terminal: 
    ```
    $ docker run -ti gcr.io/cmpt470-firms/firmsimage
    ```

# Deployment of docker image with Google Cloud Run API

1. Enable Google Cloud Run API on Google Cloud Platform Project

2. Create a service account for the Cloud Run Service by going to [Service Accounts Page](https://console.cloud.google.com/iam-admin/serviceaccounts?project=cmpt470-firms&supportedpurview=project)

3. Select cmpt470-firms project, click create an account, fill in all necessary settings. Set account as Service Account Admin.

4. After account has been created, stay on the same page. Locate the created account in the Service Accounts Page table and check the checkbox for that row.

5. Once checkbox is checked, click on "Show info panel" button. Upon clicking, a panel should expand and you need to click an "add member" button to add a specific user to manage the service account.

6. Set the user name to: '''<Project_number>@cloudbuild.gserviceaccount.com'''
    ```
    286508029428@cloudbuild.gserviceaccount.com
    ```
7. Add the role "Service Account User" to this user. Click create after.

8. After the user settings have been created, create a Cloud Run Service from the [Cloud Run Services Page](https://console.cloud.google.com/run?project=cmpt470-firms&folder=&organizationId=) for serverless deployment of created docker image earlier that was pushed to Google Cloud Platform cmpt470-firms project

9. Select the following options for the Service
    - Choose cloud run fully managed
    - Region: us-west1 Oregon
    - Number of CPUs: 1
    - Memory: 1 GB
    - Authentication: Allow unauthenticated invocations //for websites or public api
    - Select the previously pushed docker container image

10. The service should now be attempting to deploy the docker container image. If successful should return a Url to the hosted website: ```https://firms-service-u2hfkqxqka-uw.a.run.app```
11. If there are issues, you will need to debug through the logs

# To update the docker image and re-deploy to Google Cloud Run API

1. In Ubuntu, git pull all updates to master branch 

2. Make sure the project works by running it locally:
    ```
    $ npm install
    $ gulp
    ```

3. Once updated master branch and confirmed working project, build the docker container:
    ```
    $ docker build -t gcr.io/cmpt470-firms/firmsimage-production -f Dockerfile-production .
    ```
    
4. Login to Google Cloud Platform
    ```
    $ gcloud auth login
    ```
5. Push the updated docker container image to Google Cloud Platform
    ```
    $ docker push gcr.io/cmpt470-firms/firmsimage-production
    ```
6. Now switch to Google Cloud Platform [Cloud Run Service Page](https://console.cloud.google.com/run/detail/us-west1/firms-service/metrics?folder=&organizationId=&project=cmpt470-firms)
7. Click on "Edit & Deploy new revision".
8. Click on container image URL* and select the latest updated production firmsimage-production
9. Click on Deploy
10. It should take several minutes to deploy, once it is finished it should re-deploy to the same [URL](https://firms-service-u2hfkqxqka-uw.a.run.app/)
