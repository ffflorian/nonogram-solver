#!/usr/bin/env node

import * as commander from 'commander';

import {NonogramSolver} from './NonogramSolver';

const {description, name, version} = require('../package.json');

commander
  .name(name)
  .description(description)
  .version(version, '-v, --version')
  .parse(process.argv);

const p1: [string, string] = ['C BA CB BB F AE F A B', 'AB CA AE GA E C D C'];

// const p2: [string, string] = [
//   'F CAC ACAC CN AAA AABB EBB EAA ECCC HCCC',
//   'D D AE CD AE A DA BBB CC AAB BAA AAB DA AAB AAA BAB AAA CD BBA DA',
// ];

// const p3 = [
//   'CA BDA ACC BD CCAC CBBAC BBBBB BAABAA ABAD AABB BBH ' +
//     'BBBD ABBAAA CCEA AACAAB BCACC ACBH DCH ADBE ADBB DBE ECE DAA DB CC',
//   'BC CAC CBAB BDD CDBDE BEBDF ADCDFA DCCFB DBCFC ABDBA BBF AAF BADB DBF AAAAD BDG CEF CBDB BBB FC',
// ];

// const p4 = [
//   'E BCB BEA BH BEK AABAF ABAC BAA BFB OD JH BADCF Q Q R AN AAN EI H G',
//   'E CB BAB AAA AAA AC BB ACC ACCA AGB AIA AJ AJ ACE AH BAF CAG DAG FAH FJ GJ ADK ABK BL CM',
// ];

new NonogramSolver(p1).solve();
