var assert    = require( "assert" );
var Container = require( "../dest" );

describe( "inra-server-container", function () {
    var a = new Container;

    describe( "#set( key, value )", function () {
        it( "should set values for keys", function () {
            a.set( "a", "foo" );
            a.set( "b", "bar" );
        } );

        it( "should override values for same keys", function () {
            a.set( "c", "initial" );
            a.set( "c", "overriden" );

            assert.equal( a.get( "c" ), "overriden" );
        } );
    } );

    describe( "#get( key )", function () {
        it( "should return correct values for existing keys", function () {
            assert.equal( a.get( "a" ), "foo" );
            assert.equal( a.get( "b" ), "bar" );
        } );

        it( "should return undefined for unsed keys", function () {
            assert.equal( a.get( "inexisting" ), undefined );
        } );
    } );

    describe( "#has( key )", function () {
        it( "should return true for existing keys", function () {
            assert.equal( a.has( "a" ), true );
            assert.equal( a.has( "b" ), true );
        } );

        it( "should return false for unsed keys", function () {
            assert.equal( a.has( "inexisting" ), false );
        } );
    } );

    describe( "#delete( key )", function () {
        it( "should delete existing key", function () {
            a.set( "delete", "value" );
            assert.equal( a.has( "delete" ), true );

            a.delete( "delete" )
            assert.equal( a.has( "delete" ), false );
        } );

        it( "should return true if deleted", function () {
            a.set( "delete", "value" );
            assert.equal( a.delete( "delete" ), true );
        } );

        it( "should return false if not deleted", function () {
            assert.equal( a.delete( "delete" ), false );
        } );
    } );

    describe( "#size", function () {
        it( "should return the amount of total keys set", function () {
            assert.equal( a.size, 3 );
        } );
    } );

    describe( "#clear()", function () {
        it( "should clear everything", function () {
            a.clear();
            assert.equal( a.size, 0 );
        } );
    } );
} );
