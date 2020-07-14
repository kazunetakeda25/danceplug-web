# config valid for current version and patch releases of Capistrano
lock "~> 3.14.1"

set :application, "web"
set :repo_url, "git@bitbucket.org:stirrepo/web.git"
set :deploy_to, "/home/danceplug/web"
set :nvm_node, "v14.4.0"
set :yarn_flags, '--silent --no-progress'
set :pm2_app_command, ''
set :pm2_app_name, "dp20web"
set :pm2_target_path, -> { "/home/danceplug/web" }
set :pm2_start_params, 'current/ecosystem.config.json'

append :linked_files, ".env"

set :keep_releases, 2

namespace :app do
  desc 'Build Nuxt application'
  task :build_nuxt do
    on roles(:web) do
      within "#{release_path}" do
        # invoke 'npm:install'
        execute './node_modules/.bin/nuxt', 'build --quiet'
      end
    end
  end
end

before 'deploy:publishing', 'app:build_nuxt'

namespace :app do
   desc 'Restart Nuxt application'
   task :restart_nuxt do
     invoke 'pm2:restart'
   end
   after 'deploy:published', 'app:restart_nuxt'
end
