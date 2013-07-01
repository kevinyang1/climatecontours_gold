// Created: 05/05/2007
// Updated: 05/05/2007

// Select canvas
// Keeps track of all information related to the select canvas.
function SelectCanvas() {

  // *******************************************
  // Private variables:
  // *******************************************

  this.annotation = null; // includes name, deleted, verified info
  this.isEditingControlPoint = 0;
  this.isMovingCenterOfMass = 0;
  this.editedControlPoints = 0; // whether the control points were edited
  
  // *******************************************
  // Public methods:
  // *******************************************

  this.GetAnnotation = function () {
    return this.annotation;
  };

  this.GetAnnoID = function () {
    if(this.annotation) return this.annotation.GetAnnoID();
    return -1;
  }

  this.didEditControlPoints = function () {
    return this.editedControlPoints;
  }

  // Attach the annotation to the canvas.
  this.AttachAnnotation = function (anno) {
    this.editedControlPoints = 0;
    this.annotation = anno;
    this.annotation.SetDivAttach('select_canvas');

    if(username_flag) submit_username();

    // Make edit popup appear.
    var pt = anno.GetPopupPoint();
    if(anno.GetVerified()) {
      this.annotation.DrawPolygon(main_image.GetImRatio());
      this.annotation.FillPolygon();
      pt = main_image.SlideWindow(pt[0],pt[1]);
      mkVerifiedPopup(pt[0],pt[1]);
      main_image.ScrollbarsOff();
    }
    else {
      this.DrawPolygon();
      main_image.SlideWindow(this.annotation.center_x,this.annotation.center_y);
    }
  };

  // Detach the annotation from the canvas.
  this.DetachAnnotation = function () {
    var anno = this.annotation;
    this.annotation = null;
    anno.DeletePolygon();

    WriteLogMsg('*Closed_Edit_Popup');
    CloseEditPopup();
    main_image.ScrollbarsOn();

    return anno;
  };

  this.ClearAnnotation = function () {
    if(this.annotation) this.annotation.DeletePolygon();
    return this.annotation;
  };

  this.RedrawAnnotation = function () {
    if(this.annotation) {
      this.annotation.DeletePolygon();
      this.DrawPolygon();
    }
  };

  // Move this canvas to the front.
  this.MoveToFront = function () {
      document.getElementById('select_canvas').style.zIndex = 0;
      document.getElementById('select_canvas_div').style.zIndex = 0;
  };

  // Move this canvas to the back.
  this.MoveToBack = function () {
      document.getElementById('select_canvas').style.zIndex = -2;
      document.getElementById('select_canvas_div').style.zIndex = -2;
  };

  this.MouseDown = function (x,y,button) {
    if(button>1) return;
    if(!this.isEditingControlPoint && this.annotation.StartMoveControlPoint(x,y,main_image.GetImRatio())) {
      this.isEditingControlPoint = 1;
      this.editedControlPoints = 1;
    }
    else if(!this.isMovingCenterOfMass && this.annotation.StartMoveCenterOfMass(x,y,main_image.GetImRatio())) {
      this.isMovingCenterOfMass = 1;
      this.editedControlPoints = 1;
    }
    else main_handler.SubmitEditLabel();
  };

  this.MouseMove = function (x,y,button) {
    if(button>1) return;
    if(this.isEditingControlPoint) {
      this.annotation.MoveControlPoint(x,y,main_image.GetImRatio());
      return;
    }
    if(this.isMovingCenterOfMass) {
      this.annotation.MoveCenterOfMass(x,y,main_image.GetImRatio());
    }
  };

  this.MouseUp = function (x,y,button) {
    if(button>1) return;
    if(this.isEditingControlPoint) {
      this.annotation.MoveControlPoint(x,y,main_image.GetImRatio());
      this.annotation.FillPolygon();
//       this.annotation.ShowControlPoints();
      this.annotation.ShowCenterOfMass(main_image.GetImRatio());
      this.isEditingControlPoint = 0;
      return;
    }
    if(this.isMovingCenterOfMass) {
      this.annotation.MoveCenterOfMass(x,y,main_image.GetImRatio());
      this.annotation.FillPolygon();
//       this.annotation.ShowControlPoints();
      this.isMovingCenterOfMass = 0;
    }
  };

  this.AllowAdjustPolygon = function () {
    var im_ratio = main_image.GetImRatio();
    this.annotation.ShowControlPoints();
    this.annotation.ShowCenterOfMass(im_ratio);
  };

  // *******************************************
  // Private methods:
  // *******************************************

  // Draw the polygon.
  this.DrawPolygon = function () {
    if(!this.annotation) return;
    var im_ratio = main_image.GetImRatio();
    this.annotation.DrawPolygon(im_ratio);
    this.annotation.FillPolygon();

    // If point has been labeled, then make autocomplete have "point"
    // be option:
    var isPoint = 0;
    if((this.annotation.GetPtsX().length==1) && (object_choices=='...')) {
      object_choices = 'point';
      object_choices = object_choices.split(/,/);
      isPoint = 1;
    }

    // If line has been labeled, then make autocomplete have "line"
    // and "horizon line" be options:
    var isLine = 0;
    if((this.annotation.GetPtsX().length==2) && (object_choices=='...')) {
      object_choices = 'line,horizon line';
      object_choices = object_choices.split(/,/);
      isLine = 1;
    }

    var m = main_image.GetFileInfo().GetMode();
//     if((m=='im') || (m=='mt')) {
      // Popup edit bubble:
      var pt = this.annotation.GetPopupPoint();
      pt = main_image.SlideWindow(pt[0],pt[1]);
      main_image.ScrollbarsOff();
      WriteLogMsg('*Opened_Edit_Popup');
      mkEditPopup(pt[0],pt[1],this.annotation);
     // mkEditPopup(pt[0],pt[1],this.annotation.GetObjName());
//     }
//     else {
//       this.annotation.ShowControlPoints();
//       this.annotation.ShowCenterOfMass(im_ratio);
//     }

    if(isPoint || isLine) object_choices = '...';
  };

}
