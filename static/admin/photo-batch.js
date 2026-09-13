// Lets you multi-select several photos in Cloudinary at once (like the
// Gallery field does) and drop them into the post body as individual
// markdown images, instead of adding one "Image" block per photo.
//
// After inserting, the photos land as one block. Toggle the editor from
// "Rich Text" to "Raw" and back (buttons top-right of the body field) to
// split them into separate image blocks you can write text between.
CMS.registerEditorComponent({
  id: 'photo-batch',
  label: 'Photos (multi-select)',
  fields: [
    {
      name: 'images',
      label: 'Photos',
      widget: 'image',
      media_library: { config: { multiple: true } },
      hint: 'Select several photos at once in Cloudinary (click multiple, holding Cmd/Ctrl). Then toggle the body editor to "Raw" and back to "Rich Text" to split them into separate images you can write text between.',
    },
  ],
  // Never meant to match real content - inserted instances always
  // serialize down to plain "![]()" images (see toBlock), which get
  // picked back up by the built-in "image" component on the next parse.
  pattern: /^<!-- photo-batch -->$/,
  fromBlock: function () {
    return { images: [] };
  },
  toBlock: function (data) {
    var images = data && data.images;
    if (!images) return '';
    if (!Array.isArray(images)) images = [images];
    return images
      .filter(Boolean)
      .map(function (src) {
        return '![](' + src + ')';
      })
      .join('\n\n');
  },
  toPreview: function (data) {
    var images = data && data.images;
    if (!images) return '';
    if (!Array.isArray(images)) images = [images];
    return images
      .filter(Boolean)
      .map(function (src) {
        return (
          '<img src="' + src + '" alt="" ' +
          'style="max-width:150px;max-height:150px;object-fit:cover;margin:4px;display:inline-block;border-radius:4px;">'
        );
      })
      .join('');
  },
});
