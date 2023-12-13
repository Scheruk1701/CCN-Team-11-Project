Group 11
Sai Teja Avadhootha (801312398)
Sudhish Cherukuri (801366050)
Deepak Nakka (801343428)
Charan Gujjalapudi (801367648)

PROJECT REPORT   
 
NeuMan: Neural Human Radiance Field from a Single Video
 
 
Objective:
The purpose of the document is to introduce the NeuMan framework, which focuses on reconstructing human and scene NeRF models from a single in-the-wild video. The framework aims to enable high-quality renderings of humans under novel poses and views without the need for multi-camera setups or manual annotations. It utilizes existing methods to estimate rough geometry and then trains two NeRF models: one for the human and one for the scene. The document also discusses the methodology, implementation details, tools used, results, challenges faced, and conclusions related to the NeuMan framework. Additionally, it highlights the importance of rendering humans and scenes realistically, enabling applications such as telegathering and creating augmented reality experiences.


Introduction

•	The document introduces the NeuMan framework, which focuses on reconstructing human and scene NeRF models from a single in-the-wild video.

•	The framework aims to enable high-quality renderings of humans under novel poses and views without the need for multi-camera setups or manual annotations.

•	It relies on existing methods to estimate rough geometry and then trains two NeRF models: a human NeRF model and a scene NeRF model.

•	The document highlights the importance of rendering humans and scenes realistically, enabling applications such as telegathering and creating augmented reality experiences.


  
Methodology 
 
The methodologies employed in the document involve utilizing off-the-shelf methods to estimate rough geometry of the human and scene, training two NeRF models (human NeRF and scene NeRF), and introducing an end-to-end SMPL optimization and an error-correction network to enable training with erroneous estimates of human geometry. Additionally, the document discusses the creation of the NeuMan dataset, which consists of 6 videos capturing a single person performing a walking sequence, enabling multi-view reconstruction. Frames are split into 80% training frames, 10% validation frames, and 10% test frames. The framework utilizes ROMP for estimating SMPL parameters, silhouette estimation, and 2D joints estimation. The methodology also includes the use of geometry correction and novel loss terms to obtain a realistic and sharp human NeRF model.

Implementation 

We dual booted our windows machine and installed Ubuntu as the packages required to run this demo are available in linux only. Below are detailed implementation steps for setting up the environment and running the demo on Ubuntu.

Neuman Project Code:
Step 1: Install Conda
we can install Miniconda, a minimal Conda installer, by running the following commands:

wget https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh
bash Miniconda3-latest-Linux-x86_64.sh

Follow the prompts to install Miniconda and update your shell.

Step 2: Download the Repository
Please extract our NeuMan repository from the drive link below.
https://drive.google.com/file/d/1pmGtYrl1fkLzm1iuiNF4-7a4FALX9ER3/view?usp=sharing

Open a terminal/command prompt in the extracted repository path and go to “ml-neuman-main” folder path

Step 3: Create and Activate Conda Environment
Create a new Conda environment using the provided `environment.yml` file:
conda env create -f environment.yml
Alternately, you can create the environment by executing:
conda create -n neuman_env python=3.7 -y;
conda activate neuman_env;
conda install pytorch==1.8.0 torchvision==0.9.0 cudatoolkit=10.2 -c pytorch;
// For RTX 30 series GPU with CUDA version 11.x, please use:
// conda install pytorch==1.8.0 torchvision==0.9.0 torchaudio==0.8.0 cudatoolkit=11.1 -c pytorch -c conda-forge
conda install -c fvcore -c iopath -c conda-forge fvcore iopath;
conda install -c bottler nvidiacub;
conda install pytorch3d -c pytorch3d;
conda install -c conda-forge igl;
pip install opencv-python joblib open3d imageio tensorboardX chumpy lpips scikit-image ipython matplotlib;
Notice that pytorch3d requires a specific version of pytorch, in our case pytorch=1.8.0.
Activate the environment:
conda activate neuman_env

Step 4: Download and Organize Data
Follow the instructions to download and organize the required datasets and models:

- Download SMPL weights and place them in `./data/smplx/smpl/SMPL_NEUTRAL.pkl`.
- Download the NeuMan dataset and pretrained models or run the provided script: `bash setup_data_and_models.sh`.

Step 5: Run the Pretrained Models

- Render 360 views of a canonical human:
python render_360.py --scene_dir ./data/bike --weights_path ./out/bike_human/checkpoint.pth.tar --mode canonical_360

- Render 360 views of a posed human:
python render_360.py --scene_dir ./data/bike --weights_path ./out/bike_human/checkpoint.pth.tar --mode posed_360

WebRTC Application:
•	First install node and npm:
https://www.geeksforgeeks.org/installation-of-node-js-on-windows/
(npm is node package manager just like pip is package installer for python)

•	Next download the code from the GitHub link provided and unzip it into a folder. Open a command prompt/terminal in that path and type the below commands:

npm init -y
npm install express socket.io
node server.js (you’ll see server running on port 3000)


Open “localhost:3000” in the browser (you'll see Sender streaming video - The output of the pretrained model)
Open another tab “localhost:3000/receiver.html” (you’ll see Receiver waiting to receive the video stream)
Next go to the Sender tab and refresh the page and comeback to Receiver tab where now you can see the video stream is received and displayed.


Results:

The results of the NeuMan framework include high-quality renderings of humans under novel poses and views, as well as the ability to reconstruct both the human and the scene with high rendering quality. The framework outperformed existing methods in terms of novel view synthesis, achieving higher rendering quality across multiple scenes.

Videos of running the pretrained Models and WebRTC Application:
https://drive.google.com/file/d/1Ollvrg0A9-h5uhrYWZ0-n6ixkw9lTds7/view?usp=sharing
https://drive.google.com/file/d/1yKeyDmiB3J1n4UHkVZFmERlf7L1zglIT/view?usp=sharing
https://drive.google.com/file/d/1dSn2RgErdwbSrLY4fH5gH-ssTrMUt45U/view?usp=sharing
https://drive.google.com/file/d/1n9sGe5krFuurmkLhcFOMEMG_SzkYu0Ms/view?usp=sharing
