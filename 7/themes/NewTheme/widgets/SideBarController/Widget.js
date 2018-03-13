define(['dojo/_base/declare',
    'dojo/on',
    'dojo/query',
    'dojo/dom-class',
    'jimu/PoolControllerMixin',
    'jimu/BaseWidget'
  ],
  function(declare, on, query, domClass, PoolControllerMixin, BaseWidget) {
  //To create a widget, you need to derive from BaseWidget.
  return declare([ BaseWidget, PoolControllerMixin], {
    // DemoWidget code goes here

    //please note that this property is be set by the framework when widget is loaded.
    //templateString: template,

    baseClass: 'jimu-widget-sidebar-controller jimu-main-background',
    allConfigs: [],
    openedWidgetId: '',
    activeIconNode: null,
    groupTooltips: {},



    postCreate: function() {
      this.inherited(arguments);
      console.log('postCreate');
      this.allConfigs = this.getAllConfigs();
      for(var i=0; i<this.allConfigs.length; i++){
        this._createIconNode(this.allConfigs[i]);
      }
      
    },

    startup: function() {
      this.inherited(arguments);
      console.log('startup');
    },

    _isGroupIcon: function(iconConfig) {
      console.log(iconConfig);
  return iconConfig.widgets && iconConfig.widgets.length > 1;
    },

    _positionTooltip: function(tooltip, iconNode) {
  var iconBoundingRect = iconNode.getBoundingClientRect();
  tooltip.style.top = iconBoundingRect.top + 'px';
  tooltip.style.left = (iconBoundingRect.width || iconNode.clientWidth) + 'px';
},

    _createIconNode: function(iconConfig, targetNode){
      var iconNode, iconImage;
      if(!targetNode) targetNode = this.containerNode;

      iconNode = document.createElement('DIV');
      iconNode.className = 'icon-node';
      if(iconConfig.icon){
        iconImage = document.createElement('img');
        iconImage.src = iconConfig.icon;
      }
      if(iconConfig.label){
        iconNode.title = iconConfig.label;
        iconImage.alt = iconConfig.label;
      }

      iconNode.appendChild(iconImage);
      targetNode.appendChild(iconNode);

      if (iconConfig.openAtStart) {
    this.activeIconNode = iconNode;
    domClass.add(iconNode, 'jimu-state-active');
    this._showWidgetContent(iconConfig);
  }

    if (this._isGroupIcon(iconConfig)) {
      if(!this.groupTooltips[iconConfig.id]) {
        var groupTooltip = 'group-tooltip';
        document.body.appendChild(groupTooltip);
        for(var i=0; i < iconConfig.widgets.length; i++) {
          this._createIconNode(iconConfig.widgets[i], groupTooltip)
        }
        this.groupTooltips[iconConfig.id] = groupTooltip;
      }
    }
      

      var self = this;
      this.own(on(iconNode, 'click', function(){
        query('.jimu-state-active', self.domNode).removeClass('jimu-state-active');
        self.panelManager.closePanel(self.openedWidgetId + '_panel');

        query('.group-tooltip').removeClass('show');

        if(self.activeIconNode === this){
          self.activeIconNode = null;
          return;
        }

        if(self._isGroupIcon(iconConfig)){
          self.openedWidgetId = null;
          domClass.add(self.groupTooltips[iconConfig.id], 'show');
          self._positionTooltip(self.groupTooltips[iconConfig.id], this);
          domClass.add(self.groupTooltips[iconConfig.id], 'show');
        } else {
          self._showWidgetContent(iconConfig);
        }
        domClass.add(this, 'jimu-state-active');
        self.activeIconNode = this;
      }));

      return iconNode;
    },

    _showWidgetContent: function(iconConfig) {
      if(this.openedWidgetId){
            this.panelManager.closePanel(this.openedWidgetId + '_panel');
          }
          var self = this;
      this.panelManager.showPanel(iconConfig).then(function (widget) {
    // the panel displays successfully
    self.own(on.once(widget, 'close', function () {
      domClass.remove(self.activeIconNode, 'jimu-state-active');
      self.activeIconNode = null;
    }));
  }, function (err) {
    // the panel failed to display
  });
      this.openedWidgetId = iconConfig.id;
      

      if(!iconConfig.inPanel) {
          var self = this;
          this.widgetManager.loadWidget(iconConfig).then(function(widget) {
    // add code to display off-panel widgets here
          self.widgetManager.openWidget(widget);
  });
        }

          

    },

    

    

    showVertexCount: function(count){
      this.vertexCount.innerHTML = 'The vertex count is: ' + count;
    }
  });
});