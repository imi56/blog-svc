class CreateBlogs < ActiveRecord::Migration[7.1]
  def change
    create_table :blogs do |t|
      t.string :user_uuid, index: true, null: false
      t.string :title, null: false
      t.text :content

      t.timestamps
    end
  end
end
