export const ender3header = (settings) => {
  return `M190 S${settings.bedTemperature}
  M109 S${settings.temperature}
  ;Sliced at: Tue 13-03-2018 09:03:51
  ;Basic settings: Layer height: 0.15 Walls: 1.2 Fill: 15
  G21        ;metric values
  G90        ;absolute positioning
  M82        ;set extruder to absolute mode
  M107       ;start with the fan off
  G28 X0 Y0  ;move X/Y to min endstops
  G28 Z0     ;move Z to min endstops
  G1 Z15.0 F3600 ;move the platform down 15mm
  G92 E0                  ;zero the extruded length
  G1 F200 E3              ;extrude 3mm of feed stock
  G92 E0                  ;zero the extruded length again
  M106 S255  ;turn fan on
  G1 F3600
  ;Put printing message on LCD screen
  M117 Printing...

  ;LAYER:0
  `
}

export const testMoves = `
G0 X50 Y50 Z10
G0 X150 Y50 Z10
G0 X150 Y150 Z10
G0 X50 Y150 Z10
`

export const toTopFooter = `
G0 X110 Y110 Z100 F3000     ;End GCode

M109 S30.000000             ;set heating to 0 before turning off
M190 R30.000000             ;set heating to 0 before turning off
M104 S0                     ;extruder heater off
M140 S0                     ;heated bed heater off (if you have it)
G91                                    ;relative positioning
G1 E-1 F300                            ;retract the filament a bit before lifting the nozzle, to release some of the pressure
G1 Z+0.5 E-5 X-20 Y-20 F3600 ;move Z up a bit and retract filament even more
G28 X0 Y0                              ;move X/Y to min endstops, so the head is out of the way
M84                         ;steppers off
G90                         ;absolute positioning
M81
`
