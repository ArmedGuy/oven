# -*- mode: ruby -*-
# vi: set ft=ruby :


Vagrant.configure("2") do |config|
  config.vm.box = "bento/ubuntu-16.04"
  config.vm.synced_folder ".", "/workspace", type: "rsync", rsync__exclude: ".git/"
  
  config.vm.provision "shell", inline: <<-SHELL
    /workspace/vagrant_provision.sh
  SHELL
end