@echo off
echo Building project...
call npm run build

echo Deploying to GitHub Pages...
cd dist
git init
git add -A
git commit -m "Deploy to GitHub Pages"
git push -f git@github.com:leon-madara/Eastleigh_Turf_Grass.git master:gh-pages
cd ..

echo Deployment complete!
echo Visit: https://leon-madara.github.io/Eastleigh_Turf_Grass/