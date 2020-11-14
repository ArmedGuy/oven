# -*- mode: ruby -*-
# vi: set ft=ruby :


Vagrant.configure("2") do |config|
  config.vm.box = "bento/ubuntu-16.04"
  
  config.vm.synced_folder ".", "/vagrant"
  config.vm.provider "virtualbox" do |v|
      v.customize ["setextradata", :id, "VBoxInternal2/SharedFoldersEnableSymlinksCreate/v-root", "1"]
  end
  
  config.vm.network "forwarded_port", host: 9000, guest: 9000
  config.vm.network "forwarded_port", host: 5555, guest: 5555
  
  config.vm.provision "shell", inline: <<-SHELL
    /vagrant/vagrant_provision.sh
  SHELL
end