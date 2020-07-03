function generatePath(points, closePath) {
  let d = "";
  points.forEach((p, i, a) => {
    if (i === 0) {
        // first point
        d += "M "
    } else if (p.q) {
        // quadratic
        d += `Q ${ p.q.x } ${ p.q.y } `
    } else if (p.c) {
        // cubic
        d += `C ${ p.c[0].x } ${ p.c[0].y } ${ p.c[1].x } ${ p.c[1].y } `
    } else if (p.a) {
        // arc
        d += `A ${ p.a.rx } ${ p.a.ry } ${ p.a.rot } ${ p.a.laf } ${ p.a.sf } `
    } else {
        d += "L "
    }

    d += `${ p.x } ${ p.y } `
    if (closePath) {
      if(i === a.length - 1) {
        if(a[0].q) {
          d += `Q ${ a[0].q.x } ${ a[0].q.y } `
        } else if(a[0].c) {
          d += `C ${ a[0].c[0].x } ${ a[0].c[0].y } ${ a[0].c[1].x } ${ a[0].c[1].y } `
        } else if(a[0].a) {
          d += `A ${ a[0].a.rx } ${ a[0].a.ry } ${ a[0].a.rot } ${ a[0].a.laf } ${ a[0].a.sf } `
        }
        d += `${ a[0].x } ${ a[0].y } `
      }
    }
  });

  if (closePath) d += "Z"

  return d
};

export default generatePath;
