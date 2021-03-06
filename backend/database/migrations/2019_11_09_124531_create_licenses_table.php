<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateLicensesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('licenses', function (Blueprint $table) {
            $table->bigIncrements('id');

            $table->decimal('cost')->nullable();
            $table->text('eula')->nullable();
            $table->integer('max_apply_count')->nullable();
            $table->timestamp('purchased_at')->nullable();
            $table->timestamp('expired_at')->nullable();

            $table->bigInteger('software_type_id')->unsigned()->nullable();
            $table->foreign('software_type_id')
                ->references('id')->on('software_types')->onDelete('cascade');

            $table->text('comment')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('licenses');
    }
}
