App.StonehearthLoadingScreenView = App.View.extend({
   templateName: 'stonehearthLoadingScreen',
   i18nNamespace: 'stonehearth',
   messageDelay: 3000,

   init: function() {
      this._super();
      var self = this;

      radiant.call('stonehearth:get_world_generation_progress')
         .done(function(o) {
            self.trace = radiant.trace(o.tracker)
               .progress(function(result) {
                  self.updateProgress(result);
               });
         });
   },

   destroy: function() {
      if (this.trace) {
         this.trace.destroy();
         this.trace = null;
      }
   },

   didInsertElement: function() {
      this._loadTipOfTheDay();

      this._progressbar = this.$('#progressbar');
      this._progressbar.progressbar({
         value: 0
      });

      var d = new Date();
      this._last_progress_update_time = d.getTime();
   },

   _loadTipOfTheDay: function() {
      var tips = i18n.t('stonehearth:ui.shell.loading_screen.tips', { returnObjectTrees: true });
      var keys = Object.keys(tips);
      var random = Math.floor(Math.random() * keys.length);
      this.set('tips', tips[keys[random]]);
   },

   updateProgress: function(result) {
      if (result.progress) {
         var d = new Date();
         var time = d.getTime();

         if (time - this._last_progress_update_time > this.messageDelay) {
            this._updateMessage();
            this._last_progress_update_time = time;
         }

         var progressVisibleValue = result.progress;
         if (progressVisibleValue > 97) {
            progressVisibleValue = 97;
         }

         this._progressbar.progressbar('option', 'value', progressVisibleValue);

         if (result.progress == 100) {
            this.trace.destroy();
            this.trace = null;

            radiant.call('stonehearth:embark_client')
               .done(function() {
                  App.navigate('game');
                  radiant.call('radiant:reload_browser');
               });
         }
      }
   },

   _updateMessage: function() {
      var tips = i18n.t('stonehearth:ui.shell.loading_screen.loading_map_flavor_text', { returnObjectTrees: true });
      var keys = Object.keys(tips);
      var random = Math.floor(Math.random() * keys.length);
      this.$('#message').html($.t(tips[keys[random]]));
   }
});
