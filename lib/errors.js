/*
    This file is part of web3.js.
    web3.js is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.
    web3.js is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Lesser General Public License for more details.
    You should have received a copy of the GNU Lesser General Public License
    along with web3.js.  If not, see <http://www.gnu.org/licenses/>.
*/
/** 
 * @file errors.js
 * @author Marek Kotewicz <marek@ethdev.com>
 * @date 2015
 */

module.exports = {
    InvalidNumberOfSolidityArgs: function () {
        return ('Invalid number of arguments to Solidity function');
    },
    InvalidNumberOfRPCParams: function () {
        return ('Invalid number of input parameters to RPC method');
    },
    InvalidConnection: function (host){
        return ('CONNECTION ERROR: Couldn\'t connect to node '+ host +'.');
    },
    InvalidProvider: function () {
        return ('Provider not set or invalid');
    },
    InvalidResponse: function (result){
        var message = !!result && !!result.error && !!result.error.message ? result.error.message : 'Invalid JSON RPC response: ' + JSON.stringify(result);
        return (message);
    },
    ConnectionTimeout: function (ms){
        return ('CONNECTION TIMEOUT: timeout of ' + ms + ' ms achived');
    }
};