# Generated by Django 4.2.6 on 2024-03-05 03:20

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('inkApi', '0003_remove_adminprofile_school_and_more'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='Branch',
            new_name='Cohort',
        ),
    ]