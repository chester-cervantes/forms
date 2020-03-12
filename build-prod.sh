#Note, must git pull for latest version before running this script 

# build the docker image
docker build -t gcr.io/cmpt470-firms/firmsimage-production -f Dockerfile-production .

# push the docker image to google cloud platform
docker push gcr.io/cmpt470-firms/firmsimage-production
